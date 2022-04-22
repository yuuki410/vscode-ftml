import { CancellationToken, TextDocumentContentProvider, Uri, authentication } from "vscode";
import { Page } from "./interface";
import { dump } from "js-yaml";

export function toWikidotRevUri(wikiSite: string, wikiPage: string, revisionOrId?: number | string): Uri {
  let rev: string | undefined;
  if (revisionOrId !== undefined) {
    rev = typeof revisionOrId == 'number' ? `revision=${revisionOrId}` : `revisionId=${revisionOrId}`;
  }
  return Uri.from({
    scheme: "wikidot-rev",
    authority: wikiSite.startsWith("http") ? wikiSite.split("://")[1] : `${wikiSite}.wikidot.com`,
    path: `/${wikiPage}.wd`,
    query: rev,
  });
}

export class WikidotRevContentProvider implements TextDocumentContentProvider {
  constructor() {}
  async provideTextDocumentContent(uri: Uri, token: CancellationToken): Promise<string> {
    let session = await authentication.getSession('wikidot', []);
    let meta = await Page.getMetadata({
      wikiSite: uri.authority.split('.')[0],
      wikiPage: uri.path.substring(1).split('.')[0],
      session: session?.accessToken,
    });
    let source = meta.revision !== undefined ? await Page.getSource(uri.authority.split('.')[0], uri.path?.substring(1).split('.')[0]) : '';
    return `---\n${dump(meta)}---\n${source}`;
  }
}