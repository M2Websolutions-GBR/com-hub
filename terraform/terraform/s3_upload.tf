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

resource "aws_s3_bucket" "upload_bucket" {
  bucket = var.S3_UPLOAD_BUCKET
}

output "upload_bucket_endpoint" {
  value = "http://${aws_s3_bucket.upload_bucket.bucket}.s3-website-${var.AWS_REGION}.amazonaws.com"
}
