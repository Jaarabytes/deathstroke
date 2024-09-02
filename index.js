const fs = require('fs');
const { exec } = require('child_process');

// When installed, this package will kill any random package in your project.
// Funny thing is it can also kill itself

function roulette() {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const allDependencies = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };
  
  const depNames = Object.keys(allDependencies);
  
  if (depNames.length === 0) {
    console.log("No dependencies to remove. Exiting.");
    return;
  }

  // Randomly select a dependency
  const randomDep = depNames[Math.floor(Math.random() * depNames.length)];
  
  console.log(`Selected dependency to remove: ${randomDep}`);
  
  // Remove the dependency from package.json
  delete packageJson.dependencies[randomDep];
  delete packageJson.devDependencies[randomDep];
  
  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
  
  // Uninstall the dependency
  exec(`npm uninstall ${randomDep}`, (err, stdout, stderr) => {
    if (err) {
      console.error(`Error uninstalling ${randomDep}:`, stderr);
    } else {
      console.log(`${randomDep} has been uninstalled.`);
    }
  });
}

// Function to uninstall itself
function selfDestruct() {
  const selfName = require('./package.json').name;
  
  console.log(`Self-destructing: Uninstalling ${selfName}`);
  exec(`npm uninstall ${selfName}`, (err, stdout, stderr) => {
    if (err) {
      console.error(`Error uninstalling ${selfName}:`, stderr);
    } else {
      console.log(`${selfName} has been uninstalled.`);
    }
  });
}

// Run the roulette
roulette();

// This brother is too emo
if (Math.random() > 0.5) {
  selfDestruct();
}
