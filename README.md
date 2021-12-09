# TrojanZoo Sphinx Theme

[![demo](https://github.com/ain-soph/trojanzoo_sphinx_theme/workflows/demo/badge.svg)](https://ain-soph.github.io/trojanzoo_sphinx_theme/)
[![release](https://img.shields.io/github/v/release/ain-soph/trojanzoo_sphinx_theme)](https://github.com/ain-soph/trojanzoo/releases)
[![pypi](https://img.shields.io/pypi/v/trojanzoo_sphinx_theme)](https://pypi.org/project/trojanzoo_sphinx_theme/)

Sphinx theme for [TrojanZoo Docs](https://ain-soph.github.io/trojanzoo) based on the [Read the Docs Sphinx Theme](https://sphinx-rtd-theme.readthedocs.io/en/latest). Forked from [Pytorch Sphinx Theme](https://github.com/pytorch/pytorch_sphinx_theme) with commit `b4d0005` at 09/24/2021.

## Difference from pytorch_sphinx_theme
This work removes all pytorch-related things and support many customizations. It also removes all other unnecessary items to make it a pure doc template.  
See demos at:  
https://ain-soph.github.io/trojanzoo_sphinx_theme/  
https://ain-soph.github.io/alpsplot/  
https://ain-soph.github.io/trojanzoo/

## Local Development

Run python setup:

```
python setup.py install
```

and install the dependencies using `pip install -r requirements.txt`

In the root directory install the `package.json`:

```
# node version 8.4.0
yarn install

```

If you have `npm` installed then run:

```
npm install
```

Run grunt to build the html site and enable live reloading of the demo app at `localhost:1919`:

```
grunt
```

The resulting site is a demo.
