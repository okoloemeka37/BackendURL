import { Command } from "commander";
import migration from "./database/commands/migrate.js";
import makeMigration from "./database/commands/makeMigration.js";

const program =new Command()

program.name('Artisan')
.description("Artisan commander")
.version('1.0.0')

program.command('migrate')
.description("Run database migrations")
.action(migration);


program.command('make:migration <name>')
.description("Create a new migration file")
.action(makeMigration)

program.parse(process.argv)