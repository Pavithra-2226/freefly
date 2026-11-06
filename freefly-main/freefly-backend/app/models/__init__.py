"""
MongoDB is schemaless — there are no SQLAlchemy-style ORM models here.
Document structure for each collection is documented in the corresponding
schema file under app/schemas/, and enforced at the API boundary by
Pydantic rather than at the database layer.
"""
