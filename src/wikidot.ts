import got from "got";

async function getWikidotPreview({source, pageName, wikiSite}: {
  source: string;
  pageName?: string;
  wikiSite: string;
}) {
  if (!wikiSite.startsWith("http")) { wikiSite = `http://${wikiSite}.wikidot.com` }
  const wikidotToken7 = Math.random().toString(36).substring(4);
  let res = await got.post(`${wikiSite}/ajax-module-connector.php`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
      Referer: 'vscode-ftml',
      Cookie: `wikidot_token7=${wikidotToken7};`,
    },
    form: {
      wikidot_token7: wikidotToken7, 
      callbackIndex: 0,
      moduleName: "edit/PagePreviewModule",
      mode: "page",
      page_unix_name: pageName ?? "",
      source: source
    }
  }).json()
  return res.body;
}

export default getWikidotPreview;