from django.test import TestCase
from pdfBase import PDFBase

# Create your tests here.

class TestPDFGeneration(TestCase):

    def setUp(self):
        print "setting up"

    def tearDown(self):
        print "cleaning up"

    def test_PDFCreator_InitializeCustomPagesize(self):
        """Test that we can create a custom page"""

        custom_args = {"page_height": 42, "page_width": 35}
        pdf = PDFBase("test", **custom_args)

        self.assertEqual(pdf.page_height, custom_args["page_height"])
        self.assertEqual(pdf.page_width, custom_args["page_width"])
        self.assertEqual(pdf.name, "test")
