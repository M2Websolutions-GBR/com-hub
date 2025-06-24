output "availibility_zones" {
  value = data.aws_availability_zones.availibility_zones.names
}

output "cluster_endpoint" {
  description = "Endpoint for EKS control plane"
  value       = module.eks.cluster_endpoint
}

output "cluster_name" {
  value = local.cluster_name
}

output "upload_bucket_endpoint" {
  value = "http://${aws_s3_bucket.upload_bucket.bucket}.s3-website-${var.region}.amazonaws.com"
}