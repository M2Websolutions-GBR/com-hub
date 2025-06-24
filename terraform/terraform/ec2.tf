# terraform {
#   required_providers {
#     aws = {
#       source = "hashicorp/aws"
#     }
#   }

#   backend "s3" {
#     bucket = "comhub-bucket-reqs"
#     key    = "terraform.tfstate"
#     region = "eu-central-1"
#   }
# }

# provider "aws" {
#   region = var.AWS_REGION
# }

module "vpc" {
  source = "terraform-aws-modules/vpc/aws"

  name = "comhub-vpc"
  cidr = "10.0.0.0/16"

  azs            = ["eu-central-1a", "eu-central-1b"]
  public_subnets = ["10.0.101.0/24", "10.0.102.0/24"]
}

resource "aws_security_group" "comhub-sg" {
  name   = "comhub-sg"
  vpc_id = module.vpc.vpc_id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "tls_private_key" "example" {
  algorithm = "RSA"
  rsa_bits = 4096
}

resource "aws_key_pair" "deployer" {
  key_name = "deployer-key"
  # public_key = var.PUBLIC_KEY
  public_key = tls_private_key.example.public_key_openssh
}

module "ec2_zone1" {
  source = "terraform-aws-modules/ec2-instance/aws"

  name          = "comhub-ec2-zone1"
  ami           = "ami-0f7204385566b32d0"
  instance_type = "t2.micro"
  key_name      = aws_key_pair.deployer.key_name

  vpc_security_group_ids = [aws_security_group.comhub-sg.id]
  subnet_id              = module.vpc.public_subnets[0]

  associate_public_ip_address = true

  user_data = <<-EOF
                #!/bin/bash
                yum update -y
                yum install docker -y
                service docker start
                usermod -a -G docker ec2-user
                chkconfig docker on
                EOF
}

# module "ec2_zone2" {
#   source = "terraform-aws-modules/ec2-instance/aws"

#   name          = "comhub-ec2-zone2"
#   ami           = "ami-0f7204385566b32d0"
#   instance_type = "t2.micro"
#   key_name      = aws_key_pair.deployer.key_name

#   vpc_security_group_ids = [aws_security_group.comhub-sg.id]
#   subnet_id              = module.vpc.public_subnets[1]

#   associate_public_ip_address = true

#   user_data = <<-EOF
#                 #!/bin/bash
#                 yum update -y
#                 yum install docker -y
#                 service docker start
#                 usermod -a -G docker ec2-user
#                 chkconfig docker on
#                 EOF
# }

resource "null_resource" "private_key" {
  provisioner "local-exec" {
    command = "echo ${tls_private_key.example.private_key_pem} > private_key.pem"
  }
}

resource "null_resource" "public_ips" {
  provisioner "local-exec" {
    command = "echo ${module.ec2_zone1.public_ip} > public_ip_zone1.txt" #  && echo ${module.ec2_zone2.public_ip} > public_ip_zone2.txt
  }
}


output "azs" {
  description = "Availability zones"
  value       = module.vpc.azs
}

output "vpcid" {
  description = "ID of the created VPC"
  value       = module.vpc.vpc_id
}

output "private_key" {
  description = "The private key for the deployer"
  value = tls_private_key.example.private_key_pem
  sensitive = true
}

output "public_ip_zone1" {
  description = "Public IP of EC2 instance in zone 1"
  value       = module.ec2_zone1.public_ip
}

# output "public_ip_zone2" {
#   description = "public IP of EC2 instance in zone 2"
#   value       = module.ec2_zone2.public_ip
# }
