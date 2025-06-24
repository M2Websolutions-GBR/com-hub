provider "aws" {
  region = var.region
}

module "eks" {
  source          = "terraform-aws-modules/eks/aws"
  version         = "20.14.0" # TODO: Keep in mind
  cluster_name    = var.cluster_name
  cluster_version = "1.23"   # TODO: Kepp in mind

  subnet_ids      = var.subnet_ids
  vpc_id          = var.vpc_id

  tags = {
    Environment = "dev"
  }
}

resource "aws_eks_node_group" "eks_nodes" {
  cluster_name    = module.eks.cluster_id
  node_group_name = "eks-nodes"
  node_role_arn   = aws_iam_role.eks_role.arn
  subnet_ids      = var.subnet_ids

  scaling_config {
    desired_size = 1
    min_size     = 1
    max_size     = 3
  }

  instance_types = ["t3.small"]

    # remote_access {
  #   ec2_ssh_key = "my-key" # TODO: Might need it later on
  # }

  tags = {
    Name = "eks-nodes"
  }
}

resource "aws_iam_role" "eks_role" {
  name               = "eks-cluster-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action   = "sts:AssumeRole"
        Effect   = "Allow"
        Principal = {
          Service = "eks.amazonaws.com"
        }
      }
    ]
  })

  managed_policy_arns = [
    "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy",
    "arn:aws:iam::aws:policy/AmazonEKSServicePolicy",
  ]
}

resource "aws_iam_role_policy_attachment" "eks_policy" {
  role       = aws_iam_role.eks_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
}

data "aws_eks_cluster_auth" "cluster" {
  name = aws_eks_cluster.cluster_name.name
}