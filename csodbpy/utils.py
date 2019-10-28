def startEngine(connectionString):
   '''
   Instantiates a database connection from a list of credentials
   connectionString: dictionary of database credentials
   returns: SQLAlchemy database engine
   '''

   from sqlalchemy import create_engine

   cs = connectionString
   
   engine = create_engine('postgresql://' + cs['SQL_USERNAME'] + ':' + cs['SQL_PASSWORD'] + '@' + cs['SQL_HOSTNAME'] + ':' + cs['SQL_PORT'] + '/' + cs['SQL_DATABASE'])

   return engine 