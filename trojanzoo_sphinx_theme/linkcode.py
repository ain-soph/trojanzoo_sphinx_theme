#!/usr/bin/env python3

import inspect
import sys
from os import path


def linkcode_helper(domain, info,
                    prefix: str,
                    github_url: str,
                    github_version: str = 'master'):
    # Resolve function for the linkcode extension.
    if domain != 'py' or not info['module']:
        return None
    # try to find the file and line number, based on code from numpy:
    # https://github.com/numpy/numpy/blob/master/doc/source/conf.py#L405
    github_url = github_url.removesuffix('/')
    obj = sys.modules[info['module']]
    for part in info['fullname'].split('.'):
        try:
            obj = getattr(obj, part)
        except Exception:
            return None

    # strip decorators, which would resolve to the source of the decorator
    # possibly an upstream bug in getsourcefile, bpo-1764286
    try:
        unwrap = inspect.unwrap
    except AttributeError:
        pass
    else:
        obj = unwrap(obj)

    try:
        fn = inspect.getsourcefile(obj)
    except Exception:
        fn = None
    if not fn:
        return None
    fn = path.relpath(fn, start=prefix)
    try:
        source, lineno = inspect.getsourcelines(obj)
        fn += f'#L{lineno}-L{lineno + len(source) - 1}'
    except Exception:
        pass
    return f'{github_url}/blob/{github_version}/{fn}'
