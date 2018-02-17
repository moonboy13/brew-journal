from django.test import TestCase
from pdfBase import PDFBase
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.rl_config import defaultPageSize
from reportlab.platypus import Paragraph

# Create your tests here.

class TestPDFGeneration(TestCase):

    def setUp(self):
        self.stylesheet = getSampleStyleSheet()

    def test_PDFBase_InitializeCustomizedOptions(self):
        """Test that we can create a custom page"""

        custom_args = {"page_height": 42, "page_width": 35, "styles": "foobar"}
        pdf = PDFBase("test", **custom_args)

        self.assertEqual(pdf.page_height, custom_args["page_height"])
        self.assertEqual(pdf.page_width, custom_args["page_width"])
        self.assertEqual(pdf.name, "test")
        self.assertEqual(pdf.styles, "foobar")

    def test_PDFBase_InitializeDefaultOptions(self):
        """Test that the default options are correctly set on the class
        when no user options are specified"""

        pdf = PDFBase("test")

        self.assertEqual(pdf.page_height, defaultPageSize[1])
        self.assertEqual(pdf.page_width, defaultPageSize[0])
        #Not asserting the sample stylesheet for now since those are deep dictionaries of various values.
        #If the compare dict can be pulled out to a root class that could be useful here.

    def test_PDFBase_InsertNewElementsIntoReport(self):
        """Test the ability to insert new elements into the report class"""

        test_elements = [
            Paragraph("Test 1", self.stylesheet['Normal']),
            Paragraph("Test 2", self.stylesheet['Normal'])
        ]

        pdf = PDFBase("TestPDF")

        for elem in test_elements:
            pdf.AddReportItem(elem)

        self.assertEqual(len(test_elements), len(pdf.report_elements))
        for i in range(0, len(pdf.report_elements)):
            self.assertEqual(test_elements[i], pdf.report_elements[i])

    def test_PDFBase_InsertingTheSameElementReplaces(self):
        """When the same element is inserted mutliple times into the report, instead of tracking a
        duplicate element the report instead replaces the first version"""

        test_element = Paragraph("Foo", self.stylesheet['Normal'])

        pdf = PDFBase("TestPDF")

        pdf.AddReportItem(test_element)

        for i in range(0, len(pdf.report_elements)):
            self.assertEqual(test_element, pdf.report_elements[i])
            self.assertEqual(test_element.getPlainText(), pdf.report_elements[i].getPlainText())

        test_element.text = "Bar"
        pdf.AddReportItem(test_element)

        for i in range(0, len(pdf.report_elements)):
            self.assertEqual(test_element, pdf.report_elements[i])
