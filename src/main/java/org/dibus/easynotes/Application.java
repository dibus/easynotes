package org.dibus.easynotes;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import org.dibus.easynotes.notes.*;

@SpringBootApplication
public class Application {

        private static final Logger log = LoggerFactory.getLogger(Application.class);

        public static void main(String[] args) {
                SpringApplication.run(Application.class);
        }

        @Bean
        public CommandLineRunner demo(NoteRepository repository) {
                return (args) -> {
                        // save a couple of customers
                        repository.save(new Note("First Note", "Here is the first description"));

			// fetch all customers
                        log.info("Notes found with findAll():");
                        log.info("-------------------------------");
                        for (Note note : repository.findAll()) {
                                log.info(note.toString());
                        }
		                    log.info("");

                      };
        }
}
