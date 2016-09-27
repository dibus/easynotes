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
      this.repository.save(new Note("First note","First Description"));
      this.repository.save(new Note("Note 2","Description 2"));
      this.repository.save(new Note("Note 3","Description 3"));
      this.repository.save(new Note("Note 4","Description 4"));
      this.repository.save(new Note("Note 5","Description 5"));
      this.repository.save(new Note("Note 6","Description 6"));
    }
}
