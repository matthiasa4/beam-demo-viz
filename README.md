# Deployment

In order to get Firebase ready for a new demo, delete all document in the collection using
```bash
export GCP_ACCOUNT=xxx # Set your GCP username
export GCP_PROJECT=yyy # Set your GCP project
firebase firestore:delete -r languages --account=$GCP_ACCOUNT --project=$GCP_PROJECT
```