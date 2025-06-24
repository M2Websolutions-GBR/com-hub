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
#   region = var.region
# }

resource "aws_s3_bucket" "upload_bucket" {
  bucket = var.s3_upload_bucket
}

# output "upload_bucket_endpoint" {
#   value = "http://${aws_s3_bucket.upload_bucket.bucket}.s3-website-${var.region}.amazonaws.com"
# }
