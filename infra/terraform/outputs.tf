output "vpc_id" { value = module.vpc.vpc_id }
output "public_subnets" { value = module.vpc.public_subnets }
output "private_subnets" { value = module.vpc.private_subnets }

output "db_endpoint" { value = module.db.db_instance_endpoint }
output "db_address" { value = module.db.db_instance_address }
output "db_port" { value = module.db.db_instance_port }
output "db_name" { value = var.db_name }
output "db_username" { value = var.db_username }
output "database_url_ssm" { value = aws_ssm_parameter.database_url.name }
output "website_bucket_name" {
  description = "Frontend S3 bucket"
  value       = aws_s3_bucket.frontend.bucket
}
