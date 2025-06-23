# Project Configuration
variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "newway-challenge"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "dev"
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be one of: dev, staging, prod."
  }
}

# AWS Configuration
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "sa-east-1"
}

# Application Configuration
variable "app_port" {
  description = "Port the application runs on"
  type        = number
  default     = 3000
}

variable "app_health_check_path" {
  description = "Health check path for the application"
  type        = string
  default     = "/health"
}

# Database Configuration
variable "db_username" {
  description = "Database username"
  type        = string
  sensitive   = true
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

variable "db_name" {
  description = "Database name"
  type        = string
  default     = "newway_challenge"
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

# Security Configuration
variable "jwt_secret" {
  description = "JWT secret key for authentication"
  type        = string
  sensitive   = true
}

variable "jwt_expires_in" {
  description = "JWT token expiration time"
  type        = string
  default     = "7d"
}

# Infrastructure Configuration
variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "container_cpu" {
  description = "CPU units for the container (1024 = 1 vCPU)"
  type        = number
  default     = 256
}

variable "container_memory" {
  description = "Memory for the container in MiB"
  type        = number
  default     = 512
}
