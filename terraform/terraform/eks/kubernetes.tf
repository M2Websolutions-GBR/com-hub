provider "kubernetes" {
  config_path = "~/.kube/config"
}

# ConfigMap für video
resource "kubernetes_config_map" "video_config" {
  metadata {
    name      = "video-config"
    namespace = "default"
  }

  data = {
    NODE_ENV              = "development"
    PORT                  = "3002"
    MONGO_URI             = "mongodb://mongoadmin:secret@mongodb:27017/com-hub?authSource=admin"
    JWT_SECRET            = "inxn76x7r8nit8rr3nzxitr83x7zrx38rr3xr8h3tr3x"
    JWT_EXPIRE            = "30d"
    JWT_COOKIE_EXPIRE     = "30"
    FILE_UPLOAD_PATH      = "./public/uploads"
    MAX_FILE_UPLOAD       = "1000000"
    AWS_ACCESS_KEY_ID     = "AKIAR77V6KMOPS5SCNWE"
    AWS_SECRET_ACCESS_KEY = "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"
    BUCKET_NAME           = "com-hub"
    AWS_REGION            = "eu-central-1"
  }
}

# ConfigMap für auth
resource "kubernetes_config_map" "auth_config" {
  metadata {
    name      = "auth-config"
    namespace = "default"
  }

  data = {
    NODE_ENV            = "development"
    PORT                = "3001"
    MONGO_URI           = "mongodb://mongoadmin:secret@mongodb:27017/com-hub?authSource=admin"
    JWT_SECRET          = "inxn76x7r8nit8rr3nzxitr83x7zrx38rr3xr8h3tr3x"
    JWT_EXPIRE          = "30d"
    JWT_COOKIE_EXPIRE   = "30"
  }
}

# ConfigMap für data
resource "kubernetes_config_map" "data_config" {
  metadata {
    name      = "data-config"
    namespace = "default"
  }

  data = {
    NODE_ENV              = "development"
    PORT                  = "3003"
    MONGO_URI             = "mongodb://mongoadmin:secret@mongodb:27017/com-hub?authSource=admin"
    AWS_ACCESS_KEY_ID     = "AKIAR77V6KMOPS5SCNWE"
    AWS_SECRET_ACCESS_KEY = "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"
    BUCKET_NAME           = "com-hub"
    AWS_REGION            = "eu-central-1"
  }
}

# MongoDB Deployment
resource "kubernetes_deployment" "mongodb" {
  metadata {
    name      = "mongodb"
    namespace = "default"
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "mongodb"
      }
    }

    template {
      metadata {
        labels = {
          app = "mongodb"
        }
      }

      spec {
        container {
          image = "mongo"
          name  = "mongodb"
          port {
            container_port = 27017
          }

          env {
            name  = "MONGO_INITDB_ROOT_USERNAME"
            value = "mongoadmin"
          }

          env {
            name  = "MONGO_INITDB_ROOT_PASSWORD"
            value = "secret"
          }

          volume_mount {
            name       = "mongo-data"
            mount_path = "/data/db"
          }
        }

        volume {
          name = "mongo-data"
          persistent_volume_claim {
            claim_name = "mongo-pvc"
          }
        }
      }
    }
  }
}

# MongoDB PersistentVolumeClaim
resource "kubernetes_persistent_volume_claim" "mongo_pvc" {
  metadata {
    name      = "mongo-pvc"
    namespace = "default"
  }

  spec {
    access_modes = ["ReadWriteOnce"]

    resources {
      requests = {
        storage = "1Gi"
      }
    }
  }
}

# MongoDB Service
resource "kubernetes_service" "mongodb" {
  metadata {
    name      = "mongodb"
    namespace = "default"
  }

  spec {
    selector = {
      app = "mongodb"
    }

    port {
      port        = 27017
      target_port = 27017
    }

    type = "ClusterIP"
  }
}

# Mongo Express Deployment
resource "kubernetes_deployment" "mongo_express" {
  metadata {
    name      = "mongo-express"
    namespace = "default"
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "mongo-express"
      }
    }

    template {
      metadata {
        labels = {
          app = "mongo-express"
        }
      }

      spec {
        container {
          image = "mongo-express"
          name  = "mongo-express"
          port {
            container_port = 8081
          }

          env {
            name  = "ME_CONFIG_MONGODB_ADMINUSERNAME"
            value = "mongoadmin"
          }

          env {
            name  = "ME_CONFIG_MONGODB_ADMINPASSWORD"
            value = "secret"
          }

          env {
            name  = "ME_CONFIG_MONGODB_URL"
            value = "mongodb://mongoadmin:secret@mongodb:27017/"
          }
        }
      }
    }
  }
}

# Mongo Express Service
resource "kubernetes_service" "mongo_express" {
  metadata {
    name      = "mongo-express"
    namespace = "default"
  }

  spec {
    selector = {
      app = "mongo-express"
    }

    port {
      port        = 8081
      target_port = 8081
    }

    type = "LoadBalancer"
  }
}

# Deployment für video
resource "kubernetes_deployment" "video_deployment" {
  metadata {
    name      = "video-deployment"
    namespace = "default"
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "video"
      }
    }

    template {
      metadata {
        labels = {
          app = "video"
        }
      }

      spec {
        container {
          image = "guckguck/video-service:latest"
          name  = "video"
          port {
            container_port = 3002
          }

          env_from {
            config_map_ref {
              name = "video-config"
            }
          }
        }
      }
    }
  }
}

# Deployment für auth
resource "kubernetes_deployment" "auth_deployment" {
  metadata {
    name      = "auth-deployment"
    namespace = "default"
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "auth"
      }
    }

    template {
      metadata {
        labels = {
          app = "auth"
        }
      }

      spec {
        container {
          image = "guckguck/auth-service:latest"
          name  = "auth"
          port {
            container_port = 3001
          }

          env_from {
            config_map_ref {
              name = "auth-config"
            }
          }
        }
      }
    }
  }
}

# Deployment für data
resource "kubernetes_deployment" "data_deployment" {
  metadata {
    name      = "data-deployment"
    namespace = "default"
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "data"
      }
    }

    template {
      metadata {
        labels = {
          app = "data"
        }
      }

      spec {
        container {
          image = "guckguck/data-service:latest"
          name  = "data"
          port {
            container_port = 3003
          }

          env_from {
            config_map_ref {
              name = "data-config"
            }
          }
        }
      }
    }
  }
}

# Deployment für frontend
resource "kubernetes_deployment" "frontend_deployment" {
  metadata {
    name      = "frontend-service"
    namespace = "default"
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "frontend-service"
      }
    }

    template {
      metadata {
        labels = {
          app = "frontend-service"
        }
      }

      spec {
        container {
          image = "guckguck/frontend-service:latest"
          name  = "frontend-service"
          port {
            container_port = 80
          }
        }
      }
    }
  }
}

# Service für video
resource "kubernetes_service" "video_service" {
  metadata {
    name      = "video-service"
    namespace = "default"
  }

  spec {
    selector = {
      app = "video"
    }

    port {
      port        = 3002
      target_port = 3002
    }

    type = "LoadBalancer"
  }
}

# Service für auth
resource "kubernetes_service" "auth_service" {
  metadata {
    name      = "auth-service"
    namespace = "default"
  }

  spec {
    selector = {
      app = "auth"
    }

    port {
      port        = 3001
      target_port = 3001
    }

    type = "LoadBalancer"
  }
}

# Service für data
resource "kubernetes_service" "data_service" {
  metadata {
    name      = "data-service"
    namespace = "default"
  }

  spec {
    selector = {
      app = "data"
    }

    port {
      port        = 3003
      target_port = 3003
    }

    type = "LoadBalancer"
  }
}

# Service für frontend
resource "kubernetes_service" "frontend_service" {
  metadata {
    name      = "frontend-service"
    namespace = "default"
  }

  spec {
    selector = {
      app = "frontend-service"
    }

    port {
      port        = 80
      target_port = 80
    }

    type = "LoadBalancer"
  }
}
