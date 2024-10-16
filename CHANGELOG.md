# CHANGELOG

## Emoji Cheatsheet
- :pencil2: doc updates
- :bug: when fixing a bug
- :rocket: when making general improvements
- :white_check_mark: when adding tests
- :arrow_up: when upgrading dependencies
- :tada: when adding new features

## Version History

### Pending Release

### v1.16.0

- :rocket: Remove empty Ingress array in Security Group to avoid incorrect positive Drift Detection

### v1.15.1

- :rocket: Remove `PhoneNumberARN` as `sms-voice` currently doesn't support Resource Restrictions

### v1.15.0

- :rocket: Set resource to `*` on `sms-voice` services per AWS Docs

### v1.14.0

- :rocket: Setup Configurationset for SMS-Voice and use auto-prefixes for setting perms

### v1.13.0

- :rocket: Add basic SMS-Voice permissions to enable text support

### v1.12.0

- :rocket: Include `kms:GenerateDataKey` in API Role

### v1.11.0

- :rocket: Include `kms:Decrypt` in API Role

### v1.10.0

- :rocket: Include Role & Group

### v1.9.0

- :rocket: Configure EC2 Policy

### v1.8.0

- :rocket: Configure existing bucket configuration

### v1.7.0

- :rocket: Add API Role with Access to Public & Content Buckets

### v1.6.0

- :rocket: Add `Public` and `Content` Buckets

### v1.5.0

- :rocket: Add Notify Topic for SMS delivery

### v1.4.0

- :rocket: Setup Alarms

### v1.3.0

- :rocket: Add Performance Insights
- :rocket: Change underlying RDS Instance to support Performance Insights
- :white_check_mark: Add GH Actions Test Runner for linting CF Templates

### v1.2.0

- :rocket: Update MySQL Version to get us back into band
- :rocket: Update our Preferred Maintenance Window

### v1.1.0

- :rocket: Releaser & additional database options

### v1.0.0

- :rocket: Initial Release

