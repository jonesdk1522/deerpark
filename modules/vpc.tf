# Module used to deploy basic VPC infrastructure
# This module creates a VPC with public and private subnets, an internet gateway, and a NAT gateway.
# It also creates route tables and associates them with the subnets.
# The module is designed to be reusable and can be used in different environments.

###########################
# VPC configuration Block #
###########################

resource "aws_vpc" "network_vpc" {
  cidr_block = var.networkVpc.cidr
  enable_dns_support = var.networkVpc.enable_dns_support
  enable_dns_hostnames = var.networkVpc.enable_dns_hostnames
  tags = merge(
    {
      Name = var.networkVpc.name
      Group = var.group
      Environment = var.environment
      Terraform = "true"

    }
  )
  
}