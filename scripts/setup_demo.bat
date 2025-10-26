@echo off
echo 🚀 Configuration des données de demonstration...
echo.

REM Activer l'environnement virtuel (ajustez le chemin selon votre configuration)
call venv\Scripts\activate.bat

REM Appliquer les migrations
echo 📦 Application des migrations...
python manage.py migrate

REM Créer les catégories
echo 📂 Création des catégories...
python manage.py create_categories

REM Créer les utilisateurs de test
echo 👥 Création des utilisateurs de test...
python manage.py create_test_users

echo.
echo ✅ Configuration terminée!
echo.
echo 🔑 Comptes de test créés:
echo    Admin: admin@test.com / admin123
echo    Candidat: candidat@test.com / candidat123
echo.
echo 🎯 Vous pouvez maintenant démarrer l'application:
echo    Backend: python manage.py runserver
echo    Frontend: cd front-end && npm run dev
echo.
pause

