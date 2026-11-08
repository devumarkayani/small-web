import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { AppModule } from '../app.module';
import { Site } from '../sites/site.schema';
import { Person } from '../people/person.schema';
import { Visit } from '../history/visit.schema';
import { htmlToText } from '../sites/sites.service';

const sites: [string, string, string, string, string][] = [
 ['tidepool.zz','The Tidepool Field Journal','Mara','A field journal about the small, busy worlds left behind by the sea.','The tidepool is never still. At low water, an entire landscape appears: anemones close like flowers, tiny crabs patrol the rocks, and the air smells of salt. Start with our guide to careful observation, then visit the coast notes.'],
 ['coastnotes.zz','Coast Notes','Mara','Notes from a changing shoreline.','A coastline is a meeting place, not a line. Wind, water, stone and people continually redraw it. Our tidepool journal records the smallest changes. For a different scale, read the weather desk and the map room.'],
 ['weatherdesk.zz','The Weather Desk','Ivo','A plain-language notebook for watching the sky.','Clouds are useful clues, but never the whole forecast. Keep a notebook of wind direction, pressure and the shape of the horizon. The coast notes explain how weather changes a shore.'],
 ['maproom.zz','The Map Room','Ivo','Maps for curious walkers.','A good map invites questions. It shows paths, but also the spaces between known places. Our walking guide follows the old lighthouse route. Some paths have changed since this map was drawn.'],
 ['lighthouse.zz','The Old Lighthouse','Mara','A history of the beacon above the northern rocks.','The lighthouse was built to make a dangerous turn legible at night. Its keeper kept careful records of fog, passing ships and migrating birds. See the archive for selected logbook entries.'],
 ['birdarchive.zz','The Bird Archive','Nia','Field records of coastal birds.','The archive is organized by habitat rather than rarity. Gulls, sandpipers and terns all tell us something about the health of a shore. The lighthouse log contains older migration observations.'],
 ['makersbench.zz','The Maker’s Bench','Nia','Small experiments in repair and making.','Repair begins with attention. Before replacing a part, learn what it does and why it failed. Our materials guide lists useful, low-waste choices. The community garden shares practical notes too.'],
 ['materialsguide.zz','A Guide to Materials','Nia','A practical guide to choosing and reusing materials.','Materials have histories. Wood carries the shape of its growth; metal can be remade; paper can return to use. The maker’s bench documents repair projects and experiments.'],
 ['communitygarden.zz','The Community Garden','Ivo','Growing things together in a shared city plot.','A garden is a shared agreement with time. Compost feeds the soil, observation guides watering, and a small harvest can connect neighbors. The materials guide has ideas for reusing containers.'],
 ['quietlibrary.zz','The Quiet Library','Mara','A reading room for essays, notes and useful questions.','A library is a place to follow a thought without needing to finish it. Begin with the field journal, or explore the archive of coastal birds. The catalogue is still growing.']
];
const links: Record<string,string[]> = {
 'tidepool.zz':['coastnotes.zz','birdarchive.zz','quietlibrary.zz','lostharbor.zz'],
 'coastnotes.zz':['weatherdesk.zz','maproom.zz','tidepool.zz'],
 'weatherdesk.zz':['coastnotes.zz','lighthouse.zz'],
 'maproom.zz':['lighthouse.zz','communitygarden.zz','oldquarry.zz'],
 'lighthouse.zz':['birdarchive.zz','weatherdesk.zz','maproom.zz'],
 'birdarchive.zz':['lighthouse.zz','quietlibrary.zz','tidepool.zz'],
 'makersbench.zz':['materialsguide.zz','communitygarden.zz','tool shed.zz'],
 'materialsguide.zz':['makersbench.zz','communitygarden.zz'],
 'communitygarden.zz':['materialsguide.zz','maproom.zz','makersbench.zz'],
 'quietlibrary.zz':['tidepool.zz','birdarchive.zz','coastnotes.zz']
};
async function main(){
 const app = await NestFactory.createApplicationContext(AppModule);
 const siteModel = app.get(getModelToken(Site.name), { strict: false }); const personModel = app.get(getModelToken(Person.name), { strict: false }); const visitModel = app.get(getModelToken(Visit.name), { strict: false });
 const people = [{name:'Alex Morgan',kind:'reader'},{name:'Sam Rivera',kind:'reader'},{name:'Jamie Chen',kind:'reader'},{name:'Mara',kind:'publisher'},{name:'Ivo',kind:'publisher'},{name:'Nia',kind:'publisher'}];
 for(const p of people) await personModel.updateOne({name:p.name},{$set:p},{upsert:true});
 for(const [address,title,author,tagline,body] of sites){
  const anchors = (links[address]||[]).map((dest,i)=>`<li><a href="${dest}">${dest==='lostharbor.zz'?'A place not found on any chart':dest==='oldquarry.zz'?'The old quarry':dest==='tool shed.zz'?'The tool shed':`Continue to ${dest}`}</a></li>`).join('');
  const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title><style>body{font:17px/1.75 Georgia,serif;max-width:720px;margin:48px auto;padding:0 24px;color:#24312e;background:#fbfaf6}small{color:#738078;text-transform:uppercase;letter-spacing:.12em}h1{font:700 42px/1.1 system-ui;letter-spacing:-.04em}a{color:#276b60}li{margin:9px 0}.rule{height:1px;background:#d9dfd8;margin:28px 0}</style></head><body><small>${address} · A small web publication</small><h1>${title}</h1><p><em>${tagline}</em></p><div class="rule"></div><p>${body}</p><p>${body.split('. ')[0]}. Take your time, follow a link, and see where a question leads.</p><h2>Keep exploring</h2><ul>${anchors}</ul><div class="rule"></div><small>Written by ${author} · The Small Web</small></body></html>`;
  await siteModel.updateOne({address},{$set:{address,title,author,html,textContent:htmlToText(html)}},{upsert:true});
 }
 const peopleDocs = await personModel.find({name:{$in:['Alex Morgan','Sam Rivera','Jamie Chen']}}).lean();
 const seeded = await visitModel.exists({personName:'Alex Morgan',address:'tidepool.zz'});
 if(!seeded){
  const trails: [string, string[]][] = [
   ['Alex Morgan',['tidepool.zz','coastnotes.zz','weatherdesk.zz','lighthouse.zz','birdarchive.zz','quietlibrary.zz','tidepool.zz','maproom.zz','communitygarden.zz','materialsguide.zz','makersbench.zz']],
   ['Sam Rivera',['makersbench.zz','materialsguide.zz','communitygarden.zz','maproom.zz','lighthouse.zz','weatherdesk.zz','coastnotes.zz']],
   ['Jamie Chen',['quietlibrary.zz','birdarchive.zz','lighthouse.zz','maproom.zz']]
  ];
  for(const [personName,trail] of trails){ const personDoc:any=peopleDocs.find((p:any)=>p.name===personName); const personId=String(personDoc._id); for(let i=0;i<trail.length;i++){const s:any=sites.find(x=>x[0]===trail[i]); await visitModel.create({personId,personName,address:trail[i],title:s?.[1]||trail[i],method:i===0?'typed':'link',visitedAt:new Date(Date.UTC(2026,9,6,12,0,0)+i*5*60*1000)});}}
 }
 console.log('Seed complete: 10 sites, 6 people and deterministic demo trails.'); await app.close();
}
main().catch(e=>{console.error(e);process.exit(1)});
