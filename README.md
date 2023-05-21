# monitor-server

For a given set of Google Cloud projects and a given set of Google Cloud zones, query for Compute Engine instances in those projects and zones, and if any instances are powered on, send a list of powered on instances in an email to a list of administrators.

You can use Cloud Scheduler to run the deployed cloud function periodically.

## Version history

Version 2.0.0 uses the Compute Engine API to query for instances in each project/zone combo.

Version 1.0.0 took a list of hostnames, sent curl requests to those hostnames, and examined the error string to determine which hosts were powered on.

## Usage

### Run from command line

```bash
$ npm run dev
```

### Deploy to Google Cloud Functions
``` bash
$ npm run deploy
```
