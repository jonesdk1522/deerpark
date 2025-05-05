variable "networkVpc" {
  description = "VPC configuration"
  type = object({
    name     = "Network VPC"
    cidr     = "10.0.0.0/16"
    azs      = list(string)
    enable_dns_support = optional(bool, true)
    enable_dns_hostnames = optional(bool, true)
  })
}

variable "private_subnet" {
  description = "Private subnet configuration"
  type = object({
    name       = string
    cidr       = string
    azs        = list(string)
    tags       = map(string)
  })
}

variable "public_subnet" {
  description = "Public subnet configuration"
  type = object({
    name       = string
    cidr       = string
    azs        = list(string)
    tags       = map(string)
    map_public_ip_on_launch = optional(bool, true)
  })
}

# Tags #

variable "environment" {
  description = "Environment name (e.g., dev, prod)"
  type        = string
  default     = "Dev"
}
variable "group" {
  description = "Group name (e.g., team, project)"
  type        = string
  default     = "EPZ"
}