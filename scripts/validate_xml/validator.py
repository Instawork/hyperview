import argparse
import logging
import sys
import re
import xmlschema

from lxml import etree

# Find line numbers in invalid XML schema output
element_re = re.compile("Element '(?P<tag>{.+}[^ \t\n\r\f\v]+?)'.*?line (?P<line_number>\\d+)")

logger = logging.getLogger("hyperview.scripts.validate_xml")

def validate_hyperview_xml(file, schema_location):
    with open(file, "r") as f:
        content = f.read()

    schema = xmlschema.XMLSchema11(schema_location)
    parser = etree.XMLParser(remove_blank_text=True)

    try:
        doc = etree.XML(content, parser=parser)
        schema.validate(doc)

    except etree.DocumentInvalid as e:
        error = str(e)

        # If we can parse an element and line number out of the schema error message.
        # Then we can include the rendered XML element in the error.
        result = element_re.search(error)
        if result:
            tag = result.group("tag")
            line_number = int(result.group("line_number"))
            error_el = None
            for el in doc.iter(tag):
                if el.sourceline == line_number:
                    # Found the invalid element at the line number
                    error_el = el
                    break
            if error_el is not None:
                # Add the invalid element to the error message.
                message = "\n\n{}\n".format(etree.tostring(error_el, pretty_print=True).decode("utf-8"))
                error += message

        return False, [f"{file}: not valid", error]

    except (
      etree.XMLSyntaxError,
      xmlschema.validators.exceptions.XMLSchemaParseError,
      xmlschema.validators.exceptions.XMLSchemaValidationError,
     ) as e:
        return False, [f"{file}: not valid", str(e)]

    return True, [f"{file}: valid"]


def main():
    exit_code = 0
    try:
        parser = argparse.ArgumentParser(description="Validate HXML files")
        parser.add_argument("--schema", required=True, help="Path to the schema file")
        parser.add_argument("files", nargs="+")

        args = vars(parser.parse_args())
        files = args.get("files")
        schema = args.get("schema")

        for file in files:
            valid, messages = validate_hyperview_xml(file, schema)
            if not valid:
                exit_code = 1
            [print(message) for message in messages if messages]


    except Exception as e:
        logger.exception(e)

    sys.exit(exit_code)


if __name__ == "__main__":
    main()
