const xmllint = require('./node_modules/xmllint/xmllint');

const xsd =
  '<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"><xs:element name="comment"><xs:complexType><xs:all><xs:element name="author" type="xs:string"/><xs:element name="content" type="xs:string"/></xs:all></xs:complexType></xs:element></xs:schema>';
const xml_valid =
  '<?xml version="1.0"?><comment><author>author</author><content>nothing</content></comment>';
const xml_invalid = '<?xml version="1.0"?><comment>A comment</comment>';

const valid_result = xmllint.validateXML({ xml: xml_valid, schema: xsd });
const invalid_result = xmllint.validateXML({ xml: xml_invalid, schema: xsd });

console.log('\nINVALID DOC', invalid_result);
