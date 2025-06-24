terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
  }

  backend "s3" {
    bucket = "comhub-reqs-bucket"
    key    = "terraform.tfstate"
    region = "eu-central-1"
  }
}

provider "aws" {
  region = var.AWS_REGION
}

resource "aws_s3_bucket" "static_bucket" {
  bucket = var.S3_STATIC_BUCKET
}

resource "aws_s3_bucket_website_configuration" "static_bucket_website" {
  bucket = aws_s3_bucket.static_bucket.id

  index_document {
    suffix = "index.html"
  }
  error_document {
    key = "error.html"
  }
}

resource "aws_s3_bucket_public_access_block" "static_bucket_access_block" {
  bucket                  = aws_s3_bucket.static_bucket.id
  depends_on              = [aws_s3_bucket.static_bucket]
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "static_bucket_policy" {
  bucket     = aws_s3_bucket.static_bucket.id
  depends_on = [aws_s3_bucket_public_access_block.static_bucket_access_block]
  policy     = <<EOF
  {
    "Version": "2012-10-17",
    "Statement":[{
        "Sid": "PublicReadGetBucketObjects",
        "Effect": "Allow",
        "Principal": "*",
        "Action":["s3:GetObject"],
        "Resource":["arn:aws:s3:::${aws_s3_bucket.static_bucket.id}/*"]
    }]
  }
  EOF
}

resource "aws_s3_object" "html_files" {
  for_each = fileset("${path.module}/html/", "*")
  #   depends_on = [ null_resource.html_files ]
  bucket       = aws_s3_bucket.static_bucket.id
  key          = each.value
  source       = "${path.module}/html/${each.value}"
  content_type = "text/html"
  etag         = filemd5("${path.module}/html/${each.value}")
}

output "static_bucket_endpoint" {
  value = "http://${aws_s3_bucket.static_bucket.bucket}.s3-website-${var.AWS_REGION}.amazonaws.com"
}
