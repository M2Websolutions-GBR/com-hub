variable "region" {
  description = "Default AWS Region"
  type        = string
  default     = "eu-central-1"
}

variable "s3_upload_bucket" {
  type = string
  description = "The name of the S3 bucket for upload"
}