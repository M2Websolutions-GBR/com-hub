# variables.tf
variable "cluster_name" {
  description = "The name of the EKS cluster"
  type        = string
  default     = "comhub-cluster"
}

variable "node_group_name" {
  description = "The name of the node group"
  type        = string
  default     = "comhub-node-group"
}

variable "node_instance_type" {
  description = "The instance type for the nodes"
  type        = string
  default     = "t3.small"
}

variable "desired_capacity" {
  description = "The desired number of nodes"
  type        = number
  default     = 1
}

variable "max_capacity" {
  description = "The maximum number of nodes"
  type        = number
  default     = 3
}

variable "min_capacity" {
  description = "The minimum number of nodes"
  type        = number
  default     = 1
}
