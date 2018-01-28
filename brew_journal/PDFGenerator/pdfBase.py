from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.rl_config import defaultPageSize
from reportlab.lib.units import inch

class PDFBase():
    """Base class for interfacing with the platypus report engine. This class will be
    reponsbile for tracking elements on a page and rendering but will not care about the
    content in the page elements."""

    # Class defaults
    page_height = defaultPageSize[1]
    page_width  = defaultPageSize[0]
    styles = getSampleStyleSheet()

    def __init__(self, pdf_name, **kwargs):
        """Class Initializer"""
        self.name = pdf_name

        #Parse the keyword arguments for any overrides
        if 'page_height' in kwargs:
            self.page_height = kwargs["page_height"]

        if 'page_width' in kwargs:
            self.page_width = kwargs["page_width"]

        if 'styles' in kwargs:
            self.styles = kwargs["style"]
