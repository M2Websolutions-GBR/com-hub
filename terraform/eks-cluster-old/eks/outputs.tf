output "cluster_id" {
  value = module.eks.cluster_id
}

output "cluster_name" {
  value = module.eks.cluster_name
}

output "kubeconfig" {
  value = aws_eks_cluster.cluster_name.kubeconfig
}
