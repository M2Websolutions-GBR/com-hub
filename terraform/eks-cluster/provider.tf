terraform {
  required_providers {
    aws = {
        source = "hashicorp/aws"
    }
    random = {
        source = "hashicorp/random"
    }
  }
  
  backend "s3" {
      bucket = "comhub-bucket-reqs"
      key    = "terraform.tfstate"
      region = "eu-central-1"
  }

  # backend "local" {
  #   path = "terraform.tfstate"
  # }
}
