from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.rl_config import defaultPageSize
from reportlab.lib.units import inch

class PDFBase():
    """Base class for interfacing with the platypus report engine. This class will be
    reponsbile for tracking elements on a page and rendering but will not care about the
    content in the page elements."""

    def __init__(self, pdf_name, **kwargs):
        """Class Initializer"""
        self.name = pdf_name
        self.report_elements = list()

        # Class defaults
        self.page_height = defaultPageSize[1]
        self.page_width  = defaultPageSize[0]
        self.styles = getSampleStyleSheet()

        #Parse the keyword arguments for any overrides
        if 'page_height' in kwargs:
            self.page_height = kwargs["page_height"]

        if 'page_width' in kwargs:
            self.page_width = kwargs["page_width"]

        if 'styles' in kwargs:
            self.styles = kwargs["styles"]


    def AddReportItem(self, new_item):
        """Adds and item to the report. If the element already exists in the report it is replaced."""

        if(new_item in self.report_elements):
            item_index = self.report_elements.index(new_item)
            self.report_elements.insert(item_index, new_item)
        else:
            self.report_elements.append(new_item)
