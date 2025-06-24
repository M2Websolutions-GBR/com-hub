variable "S3_REQS_BUCKET" {
  type = string
  description = "The name of the S3 bucket for tfstate"
}

# variable "S3_REQS_BUCKET" {
#   type = string
#   description = "The name of the S3 bucket for requierments"
# }

variable "AWS_REGION" {
  type        = string
  description = "The AWS region where resources will be created."
  default     = "eu-central-1"
}