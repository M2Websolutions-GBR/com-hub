terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
  }
}

provider "aws" {
  region = var.AWS_REGION
}

resource "aws_s3_bucket" "upload_bucket" {
  bucket = var.S3_REQS_BUCKET
}
