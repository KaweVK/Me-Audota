package kawe.vk.me_audota;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class MeAudotaApplication {

	public static void main(String[] args) {
		SpringApplication.run(MeAudotaApplication.class, args);
	}

}
