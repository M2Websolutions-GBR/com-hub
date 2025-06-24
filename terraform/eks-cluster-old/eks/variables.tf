variable "region" {
  description = "AWS region"
  default     = "eu-central-1"
}

variable "vpc_id" {
  description = "The VPC ID for the EKS cluster"
}

variable "subnet_ids" {
  description = "The subnet IDs for the EKS cluster"
}

variable "cluster_name" {
  description = "The name of the EKS cluster"
  default     = "my-eks-cluster"
}
