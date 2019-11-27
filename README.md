Basic Contacts
==============

This is a basic application to create, query, and delete contacts from a database.

## How to Use

### Query

To query the database for all contacts, *GET* `/contacts` request is
what is needed to return a payload of all contacts

### Create

To create a new contact a *POST* `/contacts` request is required with a JSON
payload. The payload will contain:

```
{
    birthday: MM/dd/YYYY
    name: {
        first: 'First Name',
        last: 'Last Name'
    }
}
```

A hash will be generated based on the `first` and `last` names to
uniquely identify each contact for quick searching the database

### Delete

In order to delete a contact, provide the `contactId` inside
of a *DELETE* `/contacts/contactId` where the *contactId* is
unique database `_id`