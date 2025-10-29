"""
Script pour attendre que la base de données soit prête
"""
import time
import os
import sys
import django
from django.db import connections
from django.db.utils import OperationalError

# Ajouter le répertoire parent au path Python
sys.path.append('/app')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

def wait_for_db():
    """Attendre que la base de données soit disponible"""
    db_conn = None
    while not db_conn:
        try:
            db_conn = connections['default']
            db_conn.cursor()
            print("Base de données connectée avec succès!")
        except OperationalError:
            print("Base de données non disponible, attente de 2 secondes...")
            time.sleep(2)

if __name__ == '__main__':
    wait_for_db()
