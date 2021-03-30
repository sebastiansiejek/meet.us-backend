```mermaid
erDiagram
	USERS o| -- |o COMPANYS : "Can has"
	USERS {
		INT_PK user_id
		STRING nickname
		STRING email
		STRING firstname
		STRING lastname
		BOOL is_active
		STRING password
		BOOL is_company
		INT_FK company_id
		INT_FK favorites_id
		STRING avatar_path
		TIMESTAMP created_at
		TIMESTAMP updated_at
	}

	COMPANYS o| -- |o ACCOUNTS : "Can has"
  	COMPANYS {
		INT_PK id
		BOOL is_active
		STRING nip
		STRING street
		STRING number
		STRING postal_code
		STRING city
		STRING country
		STRING logo_path
		INT_FK account_id
		STRING name
		NIP number
		TIMESTAMP created_at
		TIMESTAMP updated_at
  	}

	ACCOUNTS {
		INT_PK id
		DOUBLE balance
		TIMESTAMP created_at
		TIMESTAMP updated_at
	}

	EVENTS |o -- o| USERS  : "Can has"
	EVENTS |o -- o| CATEGORIES  : "Can has"
	EVENTS |o -- o| IMAGES : "Can has"
  	EVENTS{
		INT_PK id
		INT_FK user_id
		STRING name
		STRING description
		STRING cover_path
		ENUM type
		ENUM state
		DATETIME start_date
		DATETIME end_date
		INT_FK category_id
		INT max_participants
		INT_FK image_id
		TIMESTAMP created_at
		TIMESTAMP updated_at
	}

	IMAGES {
		INT_PK id
		INT_FK event_id
		STRING path
		TIMESTAMP created_at
		TIMESTAMP updated_at
	}

	PARTICIPANTS }o -- o{ EVENTS : "Can has"
	PARTICIPANTS }o -- o{ USERS : "Can has"
	PARTICIPANTS {
		INT_PK participant_id
		INT_FK event_id
		INT_FK user_id
		ENUM state_id
		TIMESTAMP created_at
		TIMESTAMP updated_at
	}

	RATES |o -- o| EVENTS : "Can has"
	RATES |o -- o| USERS : "Can has"
	RATES {
		INT_PK id
		INT_FK user_id
		INT_FK event_id
		INT rate
		STRING description
		STRING user_nickname
		TIMESTAMP created_at
		TIMESTAMP updated_at
	}

	PAYMENTS }o -- o{ EVENTS : "Can has"
	PAYMENTS }o -- o{ USERS : "Can has"
	PAYMENTS }o -- o{ TICKETS : "Can has"
	PAYMENTS {
		INT_PK id
		INT_FK user_id
		INT_FK event_id
		INT_FK ticket_id
		ENUM type
		ENUM status
		DOUBLE price
		INT quantity
		STRING description
		INT err_code
		TIMESTAMP created_at
		TIMESTAMP updated_at
	}

	INVOICES }o -- o{ USERS : "Can has"
	INVOICES }o -- o{ COMPANYS : "Can has"
	INVOICES{
		INT_PK id
		INT_FK user_id
		INT_FK company_id
		ENUM status
		DOUBLE amount
		STRING description
		INT err_code
		TIMESTAMP created_at
		TIMESTAMP updated_at
	}


	FAVORITES_CATEGORIES{
		INT_FK user_id
		JSON category
		TIMESTAMP created_at
		TIMESTAMP updated_at
	}

	CATEGORIES{
		INT_PK id
		STRING category
		STRING sub_category
		TIMESTAMP created_at
		TIMESTAMP updated_at
	}

	TICKETS{
		INT_PK id
		INT_FK events_id
		STRING name
		DOUBLE price
		INT quantity
		TIMESTAMP created_at
		TIMESTAMP updated_at
	}

	NOTIFICATIONS }o -- o{ USERS : "Can has"
	NOTIFICATIONS{
		INT_PK id
		INT_FK user_id
		ENUM type
		STRING title
		STRING body
		BOOL is_read
		TIMESTAMP created_at
		TIMESTAMP updated_at
	}
	
	POSTS }o -- o{ USERS : "Can has"
	POSTS }o -- o{ EVENTS : "Have"
	POSTS{
		INT_PK id
		INT_FK user_id
		INT_FK event_id
		STRING user_nickname
		STRING body
		ENUM state
		TIMESTAMP created_at
		TIMESTAMP updated_at
	}

	COMMENTS }o -- o{ POSTS : "Can has"
	COMMENTS }o -- o{ USERS : "Can has"
	COMMENTS{
		INT_PK id
		INT_FK user_id
		INT_FK post_id
		STRING user_nickname
		STRING body
		ENUM state
		TIMESTAMP created_at
		TIMESTAMP updated_at
	}

	STATES{
		INT_PK id
		STRING name
	}
```
