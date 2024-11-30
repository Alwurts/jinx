import { XMLParser, XMLBuilder } from 'fast-xml-parser';

export function normalizeXML(xmlString: string): string {
    // Configure parser options
    const parserOptions = {
        ignoreAttributes: false,
        attributeNamePrefix: '@_',
        allowBooleanAttributes: true,
    };

    // Configure builder options
    const builderOptions = {
        ignoreAttributes: false,
        attributeNamePrefix: '@_',
        format: true,
        suppressBooleanAttributes: false,
    };

    try {
        // Parse XML string to JS object
        const parser = new XMLParser(parserOptions);
        const parsedXML = parser.parse(xmlString);

        // Convert back to XML string
        const builder = new XMLBuilder(builderOptions);
        return builder.build(parsedXML);
    } catch (error) {
        console.error('Error normalizing XML:', error);
        return "";
    }
}
