# Generated manually

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('categories', '0004_categoryclass_category_category_class'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='category',
            name='icon',
        ),
        migrations.RemoveField(
            model_name='category',
            name='color_gradient',
        ),
    ]
