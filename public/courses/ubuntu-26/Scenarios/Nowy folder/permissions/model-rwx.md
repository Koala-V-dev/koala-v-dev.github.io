<data-permission-scenario
  id="rwx-01"
  title="Model uprawnień: plik raportu"
  file-name="raport.txt"
  file-type="file"
  owner-name="Jan"
  group-name="pracownicy"
  show-special="false"
>
  <initial
    owner-r="true" owner-w="true" owner-x="false"
    group-r="true"  group-w="false" group-x="false"
    other-r="false" other-w="false" other-x="false"
  />

  <identity id="owner" label="Jan (właściciel)" />
  <identity id="group" label="Marta (z grupy pracownicy)" />
  <identity id="other" label="Gość (inna grupa lub bez konta)" />
</data-permission-scenario>
