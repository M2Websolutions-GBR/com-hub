variable "S3_STATIC_BUCKET" {
  type        = string
  description = "The name of the S3 bucket for static website hosting"
}

variable "S3_UPLOAD_BUCKET" {
  type = string
  description = "The name of the S3 bucket for upload"
}

# variable "S3_REQS_BUCKET" {
#   type = string
#   description = "The name of the S3 bucket for requierments"
# }

# variable "PUBLIC_KEY" {
#   description = "The public key for the AWS key pair"
#   type = string
# }

variable "AWS_REGION" {
  type        = string
  description = "The AWS region where resources will be created."
  default     = "eu-central-1"
}
