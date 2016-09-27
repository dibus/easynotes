package org.dibus.easynotes;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import org.dibus.easynotes.notes.*;

@Component
public class DatabaseLoader implements CommandLineRunner {

    private final NoteRepository repository;

    @Autowired
    public DatabaseLoader(NoteRepository repository){
      this.repository=repository;
    }

    @Override
    public void run(String... strings) throws Exception {
      this.repository.save(new Note("First note",
                                    "First Description"));
    }
}
