import fs from 'fs';
import compute from '@google-cloud/compute';
import postmark from 'postmark';
import functions from '@google-cloud/functions-framework';

const loadJSON = (path) => JSON.parse(fs.readFileSync(new URL(path, import.meta.url)));

const config = loadJSON('./config.json');

const findPoweredOnInstances = async (projectId, zone) => {
  const instancesClient = new compute.InstancesClient();

  try {
    const [instanceList] = await instancesClient.list({
      project: projectId,
      zone,
    });

    return instanceList.filter((instance) => instance.status !== 'TERMINATED')
      .map((instance) => ({
        project: projectId,
        name: instance.name,
        status: instance.status,
      }));
  } catch (e) {
    return [];
  }
};

const sendEmail = (poweredOnInstances) => {
  const client = new postmark.ServerClient(config.postmark_api_key);

  const htmlList = poweredOnInstances
    .map((instance) => `<li>
      <a href="https://console.cloud.google.com/compute/instances?project=${instance.project}">${instance.project}</a>
      - ${instance.name}: ${instance.status}
    </li>`)
    .join('');

  return client.sendEmail({
    From: config.from_address,
    To: config.emails.join(', '),
    Subject: 'Server status notification',
    HtmlBody: `<html><body><p>The following instances are powered on:</p><ul>${htmlList}</ul></body></html>`,
  });
};

const main = async () => {
  const promises = [];

  config.projectIds.forEach((projectId) => {
    config.zones.forEach((zone) => {
      promises.push(findPoweredOnInstances(projectId, zone));
    });
  });

  let poweredOnInstances = [];

  const results = await Promise.all(promises);

  results.forEach((instances) => {
    poweredOnInstances = poweredOnInstances.concat(instances);
  });

  if (poweredOnInstances.length > 0) {
    await sendEmail(poweredOnInstances);
  }
};

functions.http('monitorServer', async (req, res) => {
  await main();

  res.send('OK');
});

export default main;
