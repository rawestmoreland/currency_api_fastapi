import argparse
from alembic import command
from alembic.config import Config
import os
from dotenv import load_dotenv


def main():
    parser = argparse.ArgumentParser(description="Alembic utility script")
    parser.add_argument("command", choices=["revision", "upgrade", "downgrade", "current"],
                        help="Alembic command to run")
    parser.add_argument(
        "--message", help="Revision message (for 'revision' command)")

    args = parser.parse_args()

    # Config instance
    if os.path.exists('.env'):
        load_dotenv()

    config = Config()

    # Main alembic configuration
    config.set_main_option("script_location", "migrations")
    config.set_main_option("prepend_sys_path", ".")
    config.set_main_option("version_path_separator", os.pathsep)
    config.set_main_option("sqlalchemy.url", os.getenv("DATABASE_URL"))

    # Uncomment below if you want to set these configurations
    # config.set_main_option("file_template", "...")
    # config.set_main_option("timezone", "...")
    # config.set_main_option("truncate_slug_length", "40")
    # config.set_main_option("revision_environment", "false")
    # config.set_main_option("sourceless", "false")
    # config.set_main_option("version_locations", "...")
    # config.set_main_option("recursive_version_locations", "false")
    # config.set_main_option("output_encoding", "utf-8")

    # Logging configuration
    config.set_section_option("loggers", "keys", "root,sqlalchemy,alembic")
    config.set_section_option("handlers", "keys", "console")
    config.set_section_option("formatters", "keys", "generic")

    config.set_section_option("logger_root", "level", "WARN")
    config.set_section_option("logger_root", "handlers", "console")
    config.set_section_option("logger_root", "qualname", "")

    config.set_section_option("logger_sqlalchemy", "level", "WARN")
    config.set_section_option("logger_sqlalchemy", "handlers", "")
    config.set_section_option(
        "logger_sqlalchemy", "qualname", "sqlalchemy.engine")

    config.set_section_option("logger_alembic", "level", "INFO")
    config.set_section_option("logger_alembic", "handlers", "")
    config.set_section_option("logger_alembic", "qualname", "alembic")

    config.set_section_option("handler_console", "class", "StreamHandler")
    config.set_section_option("handler_console", "args", "(sys.stderr,)")
    config.set_section_option("handler_console", "level", "NOTSET")
    config.set_section_option("handler_console", "formatter", "generic")

    config.set_section_option("formatter_generic", "format",
                              "%%(levelname)-5.5s [%%(name)s] %%(message)s")
    config.set_section_option("formatter_generic", "datefmt", "%%H:%%M:%%S")

    # post_write_hooks can be added here too if needed

    if args.command == "revision":
        message = args.message or input("Enter a revision message: ")
        command.revision(config, message=message, autogenerate=True)

    elif args.command == "upgrade":
        command.upgrade(config, "head")

    elif args.command == "downgrade":
        command.downgrade(config, "-1")

    elif args.command == "current":
        command.current(config)


if __name__ == "__main__":
    main()
