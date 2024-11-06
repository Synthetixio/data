import * as yaml from "yaml";
import * as fs from "fs";
import * as path from "path";

interface NetworkConfig {
    network: {
        network_id: number
        archive_url: string
    }
    configs: {
        [key: string]: {
            range: {
                from: number
                to: number | "latest"
            }
        }
    }
}

export function loadNetworkConfig(networkName: string): NetworkConfig {
    const configPath = path.join(__dirname, "..", "networks", networkName, "network_config.yaml");
    const fileContents = fs.readFileSync(configPath, "utf8");
    return yaml.parse(fileContents)
}