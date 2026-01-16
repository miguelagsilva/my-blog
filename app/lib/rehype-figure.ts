import { visit } from 'unist-util-visit';
import type { Root, Element, Text } from 'hast';

export default function rehypeFigure() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element, index, parent) => {
      if (node.tagName === 'img' && parent && typeof index === 'number') {
        const alt = (node.properties?.alt as string | undefined) || '';
        
        // Only wrap if there's alt text
        if (alt && alt.trim()) {
          const figure: Element = {
            type: 'element',
            tagName: 'figure',
            properties: {
              className: ['image-figure'],
            },
            children: [
              {
                ...node,
                properties: {
                  ...node.properties,
                  alt: alt, // Keep alt for accessibility
                },
              } as Element,
              {
                type: 'element',
                tagName: 'figcaption',
                properties: {
                  className: ['image-caption'],
                },
                children: [
                  {
                    type: 'text',
                    value: alt,
                  } as Text,
                ],
              } as Element,
            ],
          };

          // Replace the img with the figure
          if (parent && 'children' in parent && Array.isArray(parent.children)) {
            parent.children[index] = figure;
          }
        }
      }
    });
  };
}
