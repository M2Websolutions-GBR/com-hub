resource "kubernetes_secret" "tls_secrets" {
  metadata {
    name      = "tls-secrets"
    namespace = "default"
  }
  data = {
    "tls.crt" = filebase64("${path.module}/../../backend/certs/fullchain.pem")
    "tls.key" = filebase64("${path.module}/../../backend/certs/privkey.pem")
  }
}

resource "kubernetes_manifest" "auth_service" {
  manifest = yamldecode(file("${path.module}/../../backend/k8s/auth-service-deployment.yml"))
}

resource "kubernetes_manifest" "data_service" {
  manifest = yamldecode(file("${path.module}/../../backend/k8s/data-service-deployment.yml"))
}

resource "kubernetes_manifest" "frontend_service" {
  manifest = yamldecode(file("${path.module}/../../backend/k8s/frontend-deployment.yml"))
}

resource "kubernetes_manifest" "mongo_express" {
  manifest = yamldecode(file("${path.module}/../../backend/k8s/mongo-express-deployment.yml"))
}

resource "kubernetes_manifest" "mongodb" {
  manifest = yamldecode(file("${path.module}/../../backend/k8s/mongodb-deployment.yml"))
}

resource "kubernetes_manifest" "video_service" {
  manifest = yamldecode(file("${path.module}/../../backend/k8s/video-service-deployment.yml"))
}

