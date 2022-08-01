#!/usr/bin/env python3

from .version import __version__

from os import path
from sphinx.util import isurl
from sphinx.util.fileutil import copy_asset

from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from docutils.nodes import Node
    from sphinx.application import Sphinx
    from sphinx.config import Config


logo_keys = ['logo', 'logo_dark', 'logo_icon']


def get_html_theme_path():
    """Return list of HTML theme paths."""
    cur_dir = path.abspath(path.dirname(path.dirname(__file__)))
    return cur_dir


def config_initiated(app: 'Sphinx', config: 'Config'):
    # remove old html_logo
    if 'html_logo' in config:
        config['html_logo'] = None


def html_page_context(app: 'Sphinx', pagename: str, templatename: str,
                      context: dict, doctree: 'Node') -> None:
    """Set up relative resource paths."""
    pathto = context.get('pathto')

    # TODO: https://github.com/sphinx-doc/sphinx/issues/9716
    # alternative: move the logo_dict modification to config/builder-initiated.
    context['theme_collapsedSections'] = context.get(
        'theme_collapsedSections', [])
    context['theme_doc_items'] = context.get('theme_doc_items', {})

    for k in logo_keys:
        v = context.get(f'theme_{k}')
        k = f'theme_{k}_url'
        if v and not isurl(v):
            context[k] = pathto(path.join(
                f'_static/logo/{path.basename(v)}'),
                resource=True)
        else:
            context[k] = v


def build_finished(app: 'Sphinx', exception: Exception):
    # copy logo files to '_static/logo/'
    for k in logo_keys:
        v: str = app.builder.theme_options[k]
        if v and not isurl(v):
            copy_asset(path.join(app.confdir, v),
                       path.join(app.outdir, '_static', 'logo'))


def setup(app: 'Sphinx'):
    # See https://www.sphinx-doc.org/en/master/development/theming.html
    app.add_html_theme('trojanzoo_sphinx_theme',
                       path.abspath(path.dirname(__file__)))
    app.connect('config-inited', config_initiated)
    app.connect('html-page-context', html_page_context)
    app.connect('build-finished', build_finished)
    return {'parallel_read_safe': True, 'parallel_write_safe': True}
