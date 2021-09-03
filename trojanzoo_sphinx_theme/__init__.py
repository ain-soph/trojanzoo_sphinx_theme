"""TrojanZoo Sphinx theme.

From https://github.com/ain-soph/trojanzoo_sphinx_theme.

"""
from os import path

__version__ = '0.0.24'
__version_full__ = __version__


def get_html_theme_path():
    """Return list of HTML theme paths."""
    cur_dir = path.abspath(path.dirname(path.dirname(__file__)))
    return cur_dir


def setup(app):
    # See https://www.sphinx-doc.org/en/master/development/theming.html
    app.add_html_theme('trojanzoo_sphinx_theme',
                       path.abspath(path.dirname(__file__)))
